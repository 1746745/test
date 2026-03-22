variable "tenant_id" {
  description = "Azure ADテナントID"
  type        = string
}

variable "admin_user_object_ids" {
  description = "管理者ロールを付与するユーザーのオブジェクトIDリスト"
  type        = list(string)
  default     = []
}

variable "user_object_ids" {
  description = "利用者ロールを付与するユーザーのオブジェクトIDリスト"
  type        = list(string)
  default     = []
}
