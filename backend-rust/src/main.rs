use axum::{
    extract::Request,
    http::StatusCode,
    middleware::{self, Next},
    response::Response,
    routing::{get, post},
    Json, Router,
};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};
use tower_http::cors::CorsLayer;

#[derive(Serialize, Deserialize, Debug)]
struct StatusResponse {
    status: String,
    system: String,
    version: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
struct ChatMessage {
    role: String,
    text: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct ChatRequest {
    message: String,
    history: Option<Vec<ChatMessage>>,
}

#[derive(Serialize, Deserialize, Debug)]
struct ChatResponse {
    text: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
struct HeistRequest {
    #[serde(rename = "codeName")]
    code_name: String,
    corporation: String,
    email: String,
    channel: String,
    brief: String,
    targets: Vec<String>,
    budget: u32,
    timeline: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct HeistResponse {
    #[serde(rename = "heistCode")]
    heist_code: String,
    status: String,
    blueprint: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct PythonBlueprintResponse {
    blueprint: String,
}

fn load_env() {
    let _ = dotenvy::dotenv();
    let root = Path::new(env!("CARGO_MANIFEST_DIR")).join("../.env.local");
    if root.exists() {
        let _ = dotenvy::from_path(root);
    }
}

fn env_or(key: &str, default: &str) -> String {
    std::env::var(key).unwrap_or_else(|_| default.to_string())
}

fn python_url(path_key: &str, path_default: &str) -> String {
    let base = env_or("PYTHON_AI_BASE_URL", "http://127.0.0.1:5000");
    let path = env_or(path_key, path_default);
    format!("{}{}", base.trim_end_matches('/'), path)
}

fn vault_dir() -> PathBuf {
    PathBuf::from(env_or("VAULT_DIR", "vault"))
}

fn bind_addr() -> String {
    let default_host = if std::env::var("PORT").is_ok() {
        "0.0.0.0"
    } else {
        "127.0.0.1"
    };
    let host = env_or("HOST", default_host);
    let port = env_or("PORT", "8081");
    format!("{}:{}", host, port)
}

fn internal_key_configured() -> Option<String> {
    let key = env_or("INTERNAL_API_KEY", "");
    if key.is_empty() {
        None
    } else {
        Some(key)
    }
}

async fn require_internal_key(request: Request, next: Next) -> Result<Response, StatusCode> {
    if let Some(expected) = internal_key_configured() {
        let provided = request
            .headers()
            .get("x-internal-key")
            .and_then(|v| v.to_str().ok())
            .unwrap_or("");
        if provided != expected {
            return Err(StatusCode::UNAUTHORIZED);
        }
    }
    Ok(next.run(request).await)
}

async fn get_status() -> Json<StatusResponse> {
    Json(StatusResponse {
        status: "ONLINE".to_string(),
        system: "BINARYSCOUTS CORE API".to_string(),
        version: "2.5.0".to_string(),
    })
}

async fn handle_chat(
    Json(payload): Json<ChatRequest>,
) -> Result<Json<ChatResponse>, (StatusCode, String)> {
    let client = Client::new();
    let python_url = python_url("PYTHON_CHAT_PATH", "/ai/chat");

    match client.post(&python_url).json(&payload).send().await {
        Ok(resp) => {
            if resp.status().is_success() {
                match resp.json::<ChatResponse>().await {
                    Ok(chat_resp) => Ok(Json(chat_resp)),
                    Err(e) => Err((
                        StatusCode::INTERNAL_SERVER_ERROR,
                        format!("Failed parsing Python AI reply: {}", e),
                    )),
                }
            } else {
                let err_text = resp.text().await.unwrap_or_default();
                Err((
                    StatusCode::BAD_GATEWAY,
                    format!("Python AI service error: {}", err_text),
                ))
            }
        }
        Err(e) => Err((
            StatusCode::SERVICE_UNAVAILABLE,
            format!("Python AI service offline: {}", e),
        )),
    }
}

async fn handle_heist(
    Json(payload): Json<HeistRequest>,
) -> Result<Json<HeistResponse>, (StatusCode, String)> {
    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_secs() % 10000)
        .unwrap_or(1234);
    let random_chars: String = (0..3)
        .map(|_| {
            let n = rand::random::<u8>() % 26;
            (b'A' + n) as char
        })
        .collect();
    let heist_code = format!("HEIST-{}{:04}", random_chars, timestamp);

    let vault_dir = vault_dir();
    if !vault_dir.exists() {
        if let Err(e) = fs::create_dir_all(&vault_dir) {
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Failed creating vault folder: {}", e),
            ));
        }
    }

    let file_path = vault_dir.join(format!("{}.json", heist_code));
    let json_data = serde_json::to_string_pretty(&payload).map_err(|e| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Failed serializing payload: {}", e),
        )
    })?;

    if let Err(e) = fs::write(&file_path, json_data) {
        return Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            format!("Failed writing to vault: {}", e),
        ));
    }
    println!("[SYSTEM] Heist details committed to vault: {:?}", file_path);

    let client = Client::new();
    let python_url = python_url("PYTHON_HEIST_PATH", "/ai/analyze-brief");

    let blueprint = match client.post(&python_url).json(&payload).send().await {
        Ok(resp) => {
            if resp.status().is_success() {
                match resp.json::<PythonBlueprintResponse>().await {
                    Ok(py_resp) => py_resp.blueprint,
                    Err(_) => {
                        "VAULT INTEGRITY SECURED. AI STRATEGY COMPILER RETURNED FAULTY FORMAT."
                            .to_string()
                    }
                }
            } else {
                "VAULT INTEGRITY SECURED. AI STRATEGY PIPELINE INTRUSION ERROR.".to_string()
            }
        }
        Err(_) => "VAULT INTEGRITY SECURED. AI STRATEGY COMPILER COOLDOWN (OFFLINE).".to_string(),
    };

    Ok(Json(HeistResponse {
        heist_code,
        status: "DISPATCHED".to_string(),
        blueprint,
    }))
}

#[tokio::main]
async fn main() {
    load_env();

    let protected = Router::new()
        .route("/api/chat", post(handle_chat))
        .route("/api/heist", post(handle_heist))
        .layer(middleware::from_fn(require_internal_key));

    let app = Router::new()
        .route("/api/status", get(get_status))
        .merge(protected)
        .layer(CorsLayer::permissive());

    let addr = bind_addr();
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    println!(
        "[SYSTEM] BinaryScouts Rust Backend booting online at http://{}",
        addr
    );
    if internal_key_configured().is_some() {
        println!("[SYSTEM] Internal API key validation enabled");
    }
    axum::serve(listener, app).await.unwrap();
}
