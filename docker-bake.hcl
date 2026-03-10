group "default" {
  targets = ["testkube-backstage"]
}

target "testkube-backstage-meta" {}
target "testkube-backstage" {
  inherits = ["testkube-backstage-meta"]
  context="."
  dockerfile = "./packages/backend/Dockerfile"
  platforms = ["linux/arm64", "linux/amd64"]
}
