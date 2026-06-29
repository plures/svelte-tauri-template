//! Thin Tauri core — events-not-commands. Commands are wrappers that emit
//! events; no business logic or persistent state lives here. State is a fact on
//! the frontend/praxis side. Mirrors `src/lib/platform/tauri.ts`.

use serde::{Deserialize, Serialize};
use tauri::{Emitter, Manager};

#[derive(Serialize, Deserialize, Clone)]
pub struct WindowState {
    pub width: f64,
    pub height: f64,
    pub x: f64,
    pub y: f64,
    pub maximized: bool,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct NavItem {
    pub id: String,
    pub label: String,
    pub visible: bool,
}

/// User navigated; re-emit so the tray/menu can sync from frontend facts.
#[tauri::command]
fn navigate(app: tauri::AppHandle, path: String) {
    let _ = app.emit("user-navigated", path);
}

/// Read live geometry from the main window.
#[tauri::command]
fn get_window_state(app: tauri::AppHandle) -> Result<WindowState, String> {
    let w = app.get_webview_window("main").ok_or("no main window")?;
    let size = w.outer_size().map_err(|e| e.to_string())?;
    let pos = w.outer_position().map_err(|e| e.to_string())?;
    let maximized = w.is_maximized().map_err(|e| e.to_string())?;
    Ok(WindowState {
        width: size.width as f64,
        height: size.height as f64,
        x: pos.x as f64,
        y: pos.y as f64,
        maximized,
    })
}

/// Persist is a frontend fact; here we just announce the change.
#[tauri::command]
fn save_window_state(app: tauri::AppHandle, state: WindowState) {
    let _ = app.emit("window-state-changed", state);
}

/// Tray menu is built from frontend nav visibility facts.
#[tauri::command]
fn set_tray_menu(_items: Vec<NavItem>) -> Result<(), String> {
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            navigate,
            get_window_state,
            save_window_state,
            set_tray_menu
        ])
        .setup(|app| {
            app.emit("app-booted", ()).ok();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
