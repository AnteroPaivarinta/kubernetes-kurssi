docker rm -f $(docker ps -aq)
kubectl delete deployment --all
k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
k3d cluster start

cd app
docker build  -no-cache -t anteropaivarinta/log-output-app:latest .
docker push anteropaivarinta/log-output-app:latest
sh manifests.sh

cd ../ping-pong
docker build  -no-cache -t anteropaivarinta/ping-pong-app:latest .
docker push anteropaivarinta/ping-pong-app:latest
sh manifests.sh





