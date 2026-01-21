docker rm -f $(docker ps -aq)
kubectl delete rollout --all -n exercises 2>/dev/null || true
kubectl delete deployment --all -n exercises
kubectl delete pvc --all -n exercises
k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
k3d cluster start

helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install kube-prometheus-stack prometheus-community/kube-prometheus-stack --create-namespace --namespace prometheus


kubectl apply -f namespace.yaml

sh log-output.sh
pwd
sh pingpong.sh
pwd
docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube


kubectl apply -f persistents/persistentvolume.yaml 
kubectl apply -f persistents/persistentvolumeclaim.yaml 


PVC_NAME="image-claim"

echo "Odotetaan, että PVC $PVC_NAME on Bound..."
while true; do
  STATUS=$(kubectl get pvc -n exercises $PVC_NAME -o jsonpath='{.status.phase}')
  if [ "$STATUS" = "Bound" ]; then
    echo "PVC $PVC_NAME on nyt Bound!"
    break
  fi
  echo "PVC ei vielä Bound, odotetaan 2 sekuntia..."
  sleep 2
done

kubectl create namespace argo-rollouts
kubectl apply -n argo-rollouts -f https://github.com/argoproj/argo-rollouts/releases/latest/download/install.yaml
kubectl apply -f manifests 
kubectl port-forward -n kube-prometheus-stack svc/kube-prometheus-stack-prometheus 9090:9090







