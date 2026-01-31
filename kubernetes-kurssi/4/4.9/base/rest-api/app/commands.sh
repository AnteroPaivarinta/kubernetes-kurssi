docker rm -f $(docker ps -aq)
kubectl delete deployment --all
k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
k3d cluster start

docker build --no-cache -t anteropaivarinta/todo-app-restapi:latest .
docker push anteropaivarinta/todo-app-restapi:latest

