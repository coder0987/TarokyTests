call kubectl delete deployments --all -n taroky-namespace
call kubectl delete services --all -n taroky-namespace

call kubectl apply -f .\kubernetes\
call kubectl apply -f .\kubernetes\professorninja-deployments\