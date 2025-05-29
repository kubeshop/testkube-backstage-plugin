#!/bin/bash
pwd
kubectl apply -n testkube -f ./examples/testkube/
for test in $(ls -1 ./examples/testkube/*.yaml); do
  filename=$(basename "$test" .yaml) # Elimina la extensión .yaml
  echo "Creating test workflow: $filename"
  curl localhost:8088/v1/test-workflows/${filename}/executions -XPOST
done
