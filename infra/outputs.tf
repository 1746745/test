output "client_id" {
  description = "VITE_AZURE_CLIENT_ID に設定する値"
  value       = azuread_application.portal_app.client_id
}

output "tenant_id" {
  description = "VITE_AZURE_TENANT_ID に設定する値"
  value       = var.tenant_id
}
