docker rm -f $(docker ps -aq)
kubectl delete deployment --all
kubectl delete pvc --all --all-namespaces
kubectl delete pv --all

k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
k3d cluster start


cd rest-api/app
docker build --no-cache -t anteropaivarinta/todo-app-restapi:latest .
docker push anteropaivarinta/todo-app-restapi:latest
cd ../..

echo "-----------------------------------------------------------------------------------------------------------------------"
pwd


cd todo-app-frontend
docker build --no-cache -t anteropaivarinta/todo-app-frontend:latest .
docker push anteropaivarinta/todo-app-frontend:latest
cd ..


echo "-----------------------------------------------------------------------------------------------------------------------"
pwd


cd todo-backend
docker build --no-cache -t anteropaivarinta/todo-app-backend:latest .
docker push anteropaivarinta/todo-app-backend:latest
cd ..
echo "-----------------------------------------------------------------------------------------------------------------------"
pwd


kubectl apply -f manifests


