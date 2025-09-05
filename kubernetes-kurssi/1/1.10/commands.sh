docker rm -f $(docker ps -aq)
kubectl delete deployment --all
k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
k3d cluster start


cd app
sh commands.sh
cd ../app2
sh commands.sh
cd ..

kubectl apply -f manifests





