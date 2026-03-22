terraform {
  required_providers {
    azuread = {
      source  = "hashicorp/azuread"
      version = "~> 2.53"
    }
  }
  required_version = ">= 1.5"
}

provider "azuread" {
  tenant_id = var.tenant_id
}
