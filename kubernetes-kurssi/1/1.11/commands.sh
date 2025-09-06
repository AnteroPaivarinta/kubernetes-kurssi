docker rm -f $(docker ps -aq)
kubectl delete deployment --all
kubectl delete pvc --all --all-namespaces
kubectl delete pv --all
k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
k3d cluster start
docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube

sh log-output.sh
pwd
sh pingpong.sh
pwd




kubectl apply -f manifests






