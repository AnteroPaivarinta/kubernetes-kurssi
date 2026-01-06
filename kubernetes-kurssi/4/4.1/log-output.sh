cd log-output-one
docker build  --no-cache -t anteropaivarinta/log-output-app-one:latest .
docker push anteropaivarinta/log-output-app-one:latest

cd ../log-output-two
docker build  --no-cache -t anteropaivarinta/log-output-app-two:latest .
docker push anteropaivarinta/log-output-app-two:latest

cd ..
