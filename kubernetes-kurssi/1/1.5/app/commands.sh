docker rm -f $(docker ps -aq)
kubectl delete deployment --all
k3d cluster create -a 2
k3d cluster start

docker build -t anteropaivarinta/todo-app:latest .
docker push anteropaivarinta/todo-app:latest
kubectl apply -f manifests/deployment.yaml
kubectl port-forward todo-app-7f6449994-4cggc 3007:3000
