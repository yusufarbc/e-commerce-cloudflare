package wrangler.security

import rego.v1

secret_name(name) if {
    regex.match("(?i)(secret|token|password|passwd|private[_-]?key|api[_-]?key)", name)
}

deny contains message if {
    some name, value in object.get(input, "vars", {})
    secret_name(name)
    value != ""
    message := sprintf("[CWE-798] Plaintext secret-like variable in [vars]: %s", [name])
}
