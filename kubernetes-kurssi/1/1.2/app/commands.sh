docker  build . -t todo-app
docker tag todo-app anteropaivarinta/todo-app:latest
docker push anteropaivarinta/todo-app:latest


kubectl create deployment todo-app --image=anteropaivarinta/todo-app:latest
