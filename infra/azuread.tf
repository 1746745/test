# -------------------------------------------------------
# Microsoft Graph サービスプリンシパルの参照
# -------------------------------------------------------
data "azuread_application_published_app_ids" "well_known" {}

data "azuread_service_principal" "msgraph" {
  client_id = data.azuread_application_published_app_ids.well_known.result.MicrosoftGraph
}

# -------------------------------------------------------
# アプリ登録
# -------------------------------------------------------
resource "azuread_application" "portal_app" {
  display_name = "PortalApp"

  # SPA（シングルページアプリケーション）のリダイレクトURI
  single_page_application {
    redirect_uris = [
      "http://localhost:3000/",
      "https://${var.tenant_id}.z11.web.core.windows.net/", # Static Web App等に合わせて変更
    ]
  }

  # Microsoft Graph の委任アクセス許可（openid / profile / email）
  required_resource_access {
    resource_app_id = data.azuread_application_published_app_ids.well_known.result.MicrosoftGraph

    resource_access {
      id   = data.azuread_service_principal.msgraph.oauth2_permission_scope_ids["openid"]
      type = "Scope"
    }
    resource_access {
      id   = data.azuread_service_principal.msgraph.oauth2_permission_scope_ids["profile"]
      type = "Scope"
    }
    resource_access {
      id   = data.azuread_service_principal.msgraph.oauth2_permission_scope_ids["email"]
      type = "Scope"
    }
  }

  # アプリロールの定義
  app_role {
    allowed_member_types = ["User"]
    description          = "管理者：ロッカーの作成・編集・削除が可能"
    display_name         = "管理者"
    enabled              = true
    id                   = "00000000-0000-0000-0000-000000000001"
    value                = "Admin"
  }

  app_role {
    allowed_member_types = ["User"]
    description          = "利用者：フロアマップと備品の閲覧・編集が可能"
    display_name         = "利用者"
    enabled              = true
    id                   = "00000000-0000-0000-0000-000000000002"
    value                = "User"
  }

  # IDトークンにrolesクレームを含める
  optional_claims {
    id_token {
      name                  = "roles"
      source                = null
      essential             = false
      additional_properties = []
    }
    access_token {
      name                  = "roles"
      source                = null
      essential             = false
      additional_properties = []
    }
  }
}

# -------------------------------------------------------
# サービスプリンシパル（エンタープライズアプリケーション）
# -------------------------------------------------------
resource "azuread_service_principal" "portal_app" {
  client_id                    = azuread_application.portal_app.client_id
  app_role_assignment_required = true # ロール割り当てなしのユーザーはアクセス不可
}

# -------------------------------------------------------
# 管理者同意の付与（openid / profile / email）
# -------------------------------------------------------
resource "azuread_service_principal_delegated_permission_grant" "portal_app_msgraph" {
  service_principal_object_id          = azuread_service_principal.portal_app.object_id
  resource_service_principal_object_id = data.azuread_service_principal.msgraph.object_id
  claim_values                         = ["openid", "profile", "email"]
}

# -------------------------------------------------------
# 管理者ロールの割り当て
# -------------------------------------------------------
resource "azuread_app_role_assignment" "admin" {
  for_each = toset(var.admin_user_object_ids)

  app_role_id         = "00000000-0000-0000-0000-000000000001"
  principal_object_id = each.value
  resource_object_id  = azuread_service_principal.portal_app.object_id
}

# -------------------------------------------------------
# 利用者ロールの割り当て
# -------------------------------------------------------
resource "azuread_app_role_assignment" "user" {
  for_each = toset(var.user_object_ids)

  app_role_id         = "00000000-0000-0000-0000-000000000002"
  principal_object_id = each.value
  resource_object_id  = azuread_service_principal.portal_app.object_id
}
