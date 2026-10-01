# Product deployment policy for api/wrangler.toml (run by devsecops-pipeline.yml).
# Wrangler config is not understood by Trivy or Checkov, so these rules encode
# the platform-specific checks from DEVSECOPS_PIPELINE.MD.
package wrangler.deploy

import rego.v1

secret_like(name) if regex.match(`(?i)(secret|token|password|passwd|private[_-]?key|api[_-]?key|credential)`, name)

# Every [vars] table: top level (local dev) and each [env.<name>.vars].
var_tables contains ["top-level", object.get(input, "vars", {})]

var_tables contains [sprintf("env.%s", [name]), object.get(env, "vars", {})] if some name, env in object.get(input, "env", {})

deny contains msg if {
	some [scope, vars] in var_tables
	some key, value in vars
	secret_like(key)
	value != ""
	msg := sprintf("[CWE-798] %s: plaintext secret-like variable %s; use `wrangler secret put`", [scope, key])
}

deny contains msg if {
	some name, env in object.get(input, "env", {})
	some db in object.get(env, "d1_databases", [])
	db.preview_database_id == db.database_id
	msg := sprintf("env.%s: D1 binding %s previews against the live database", [name, db.binding])
}

deny contains msg if {
	some name, env in object.get(input, "env", {})
	some bucket in object.get(env, "r2_buckets", [])
	bucket.preview_bucket_name == bucket.bucket_name
	msg := sprintf("env.%s: R2 binding %s previews against the live bucket", [name, bucket.binding])
}

deny contains msg if {
	some name in {"staging", "production"}
	vars := object.get(object.get(object.get(input, "env", {}), name, {}), "vars", {})
	contains(object.get(vars, "CORS_ORIGIN", ""), "*")
	msg := sprintf("env.%s: CORS_ORIGIN must list explicit origins, not *", [name])
}
