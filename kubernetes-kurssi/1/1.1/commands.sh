docker build -t log-output-app:latest .
kubectl create deployment generator --image=anteropaivarinta/log-output-app

