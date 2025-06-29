call npm --prefix .\room run build
call npm --prefix .\server run build
call npm --prefix .\manager run build

call docker build -t professorninja/taroky-room:latest .\room
call docker build -t professorninja/taroky-server:latest .\server
call docker build -t professorninja/taroky-manager:latest .\manager
call docker build -t professorninja/taroky-nginx:latest .\nginx

call docker push professorninja/taroky-room:latest
call docker push professorninja/taroky-server:latest
call docker push professorninja/taroky-manager:latest
call docker push professorninja/taroky-nginx:latest

call kubectl delete deployments --all -n taroky-namespace
call kubectl delete services --all -n taroky-namespace

call kubectl apply -f .\kubernetes\
call kubectl apply -f .\kubernetes\professorninja-deployments\