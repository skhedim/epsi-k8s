# Creating your own chart

We will create a basic `Chart` from scratch. The first thing we
need to look at is the structure of a `Chart`.

## Chart structure

You need to create a folder structure like this, starting with a folder named
like your application:

```bash
wikijs/
    Chart.yaml              # A YAML file containing information about the chart.
    LICENSE                 # OPTIONAL: A plain text file containing the license for the chart.
    README.md               # OPTIONAL: A human-readable README file.
    values.yaml             # The default configuration values for this chart.
    charts/                 # OPTIONAL: A directory containing any charts upon which this chart depends.
    templates/              # A directory of templates that, when combined with values, will generate valid Kubernetes manifest files.
    templates/NOTES.txt     # OPTIONAL: A plain text file containing short usage notes
```

## Building a Chart

For our demo, we will package an application called [wiki.js](https://wiki.js.org). Wiki.js is a wiki engine running on Node.js. It is free software released under the Affero GNU General Public License. It's available as self-hosted solution or using the 1-click install on the DigitalOcean and AWS marketplace.

Wiki.js needs a place to persist data. Things like pictures and other binary data
will be placed on the filesystem. Other data needs to be stored
in a database. Since we want to start simple, we will use Postgres. First let's create the folder structure (somewhere on your local filesystem).

```bash
cd wikijs
```

Next you need to open this dir with an editor of your choice.
We start with editing the `Chart.yaml` file:

In this file we will collect the basic metadata for the chart. Every chart needs
a `name` a `version` and a `description`. With `version` we reference to the
version of the Chart. In addition there is the `appVersion` which reflects the
version of the packaged software. The `home` key is optional but useful
to point to the official website of an application. In addition to that, you can
define links to `sources`. It can also very helpful to define maintainers
of a chart, so you can contact that person in case of questions or
improvements to a specific chart. The `icon` is only important when you publish
the chart to a web frontend which lets you browse charts.

We will skip the `README.md` and the `values.yaml` for now. First let's jump
into the `templates` folder and create the Kubernetes resources we need. At this
point some basic Kubernetes knowledge is of help. We know that Wiki.js is no
stateless application (we need to store things). The next question we need to answer is: should other services or users access Wiki.js? Since it's a wiki software, I think we can answer this with YES. Users should be able to access Wiki.js. So we need at
least a Service object and in most cases also an Ingress object.

````bash
cd templates
touch deployment.yaml service.yaml ingress.yaml pvc.yaml
````

Let's first setup the ingress:

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: {{ .Release.Name }}
  namespace: {{ .Release.Namespace }}

spec:
  rules:
  - host: "{{ .Values.ingressUrl }}
    http:
      paths:
      - backend:
          serviceName: {{ .Release.Name }}
          servicePort: {{ .Values.service.port }}
```

This looks like a normal Kubernetes manifest file right? The only difference you
will notice is that we use Go templating to make the manifest file
dynamic. What does that mean exactly? The variables we define here, will be
replaced dynamically when the chart is rendered.

```yaml
name: {{ .Release.Name }}
```

`{{ .Release.Name }}` will be replaced with the values of the command line flag
`--name wiki`. When the template is rendered you will see:

```yaml
name: wiki
```

`Release` is another, so called, built-in object. For a list of built-in object please
take a look at [Build-In objects](https://docs.helm.sh/chart_template_guide/#built-in-objects).

The `Values` object is referencing the `values.yaml` file in the top level folder
of the chart. We will take a look at this later. At this point you only need to
know that every variable starting with `Values` is taken from `values.yaml`.

## It's your turn now

By combining what has been seen during the course, the above introduction, and the official Helm documentation you should be able to write the rest of the Helm chart by yourself. Please follow the order of the tasks to be performed.

### Write the Service

Create your service object, and configure the variables to use the correct deployment information.

In the Service object you will find the Release object and as well as some vars starting with Values. There is a new object, the Chart object, that is referencing the Chart.yaml file. There is another new part, which looks like this:

```yaml
app: {{ template "wikijs.fullname" . }}
```

With the template function, you can dynamically include complex blocks. It's like an include function. This function can be helpful when you need a block multiple times. It also helps you clean up the yaml files and make them easier to read through. In our case we will call the template with the name ghost.fullname. Helm will try to lookup a block with that name in the _helpers.tpl file located in the templates dir.

As you can see, we use the keyword define with the name of the template and use end to tell the interpreter where it ends. Notice how the template name is prefixed with the name of our chart, to make sure the template is not accidentialy overwritten. This template makes sure that the app name will not reach more than 63 chars. For more information about these named templates please check [here](https://docs.helm.sh/chart_template_guide/#named-templates).

### Write the Secret

For the proper functioning of the wiki you will need a database (Postgres), this database will be deployed as a dependency of the chart you create.

To connect to the database you will need to send the login information as an environment variable to the container. So we will use a secret that we will mount in the container with the parameter envFrom.

Create a secret containing the following environment variables and variabilize these values.

DB_TYPE : Type of database (mysql, postgres, mariadb, mssql or sqlite)
DB_HOST : Hostname or IP of the database
DB_PORT : Port of the database
DB_USER : Username to connect to the database
DB_PASS : Password to connect to the database
DB_NAME : Database name

Don't forget that to create a secret in YAML the values of the secret must be passed in base64. You can do this directly through helm using the [b64enc](https://helm.readthedocs.io/en/latest/generate-and-template/).
 option 

> Hint: To generate an example of the yaml to be variabilized to create a secret you can use the following command: kubectl create secret generic slack --from-literal=DB_PASS=azerty --from-literal=DB_NAME=mydb --dry-run -o yaml

### Write the Deployment

Now you have to write your deployment object in order to start the application. We will use the image that is already built by the creators of wiki.js.

So create your deployment YAML, and try to variabilize as many fields as possible. In particular the fields that must get information from other objects (service, secret).

You will use the following image: ***requarks/wiki:2***, and you will have to variabilize the image field in order to be able to change it quickly.

Remember to import the environment variables s created in secrecy above. For this you can use the envFrom parameter.

> As for any kuberentes resource you can generate a sample yaml with the kubectl command as follows: kubectl create deply wiki --image=requarks/wiki:2 -o yaml --dry-run

### Add the postgres dependency

Now we're going to add potgres dependency on our chart, this way when we deploy our wiki a postgres will be deployed via the official repository.

You will have to add your dependencies in the Chart.yaml file of the chart, here is an example of dependency with MariaDB

```yaml
dependencies:
- name: mariadb
  version: 5.x.x
  repository: https://kubernetes-charts.storage.googleapis.com/
  condition: mariadb.enabled
```

You will be able to deploy this chart according to a condition in your values.yaml file. You will be able to disable postgres, and for example manage another dependency like MariaDB which is also compatible with wiki.js.

By calling a dependency you will also be able to configure the variables of this chart directly from yours. Here is an example with the MariaDB chart. In the example it changes the image tag used by default in the chart

```yaml
mariadb:
  enabled: true
  image:
    tag: 0.6.3
```

Create the dependency with postgres in the Chart.yaml file, and add the variable to disable the persistence of the data.

### Fill your values.yaml file

You must now fill in all the variables you add in your YAML templates. If you have done so, check that they are not missing, and set a default value for all your values.

Don't forget to specify a default value for each of the variables in order to be able to deploy the chart without changing its values.

### Test your chart

Now if you think you're done, you can unfold your chart on your minikube. You can start by linting your chart, to look for possible syntax errors.

> You must be at the root of the helm chart folder, where the file Chart.yaml is located.

```bash
helm lint .
==> Linting .
[INFO] Chart.yaml: icon is recommended

1 chart(s) linted, 0 chart(s) failed
```

No error has been reported, but that doesn't mean that your chart will work for sure, but it indicates that there is no syntax error, it's already a first step.

To deploy a chart you can use the following commands:

```bash
# This command will download the dependencies (Postgres in our case)
helm dep update
helm install wikijs .
NAME: wikijs
LAST DEPLOYED: Tue Mar  3 12:48:34 2020
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
NOTES:
1. Get the application URL by running these commands:
```

Here you might get other errors specific to the syntax of Kubernetes resources. You can debug using pre-filled yaml with values and check the indentatioons the position of the different fields etc. To generate pre-filled yaml, you can use the following command:

```bash
helm template .
```

Once your chart is deployed without error, let's see if we can access the wiki and if everything works. You can use the following command to display the container logs:

```bash
kubectl get po
NAME                                             READY   STATUS    RESTARTS   AGE
nginx-ingress-controller-74449848b6-2xs5b        1/1     Running   7          26h
nginx-ingress-default-backend-659bd647bd-pd22q   1/1     Running   4          26h
wikijs-5bcf859cf6-h67cz                          1/1     Running   1          10m
wikijs-postgresql-0

kubectl logs -f wikijs-5bcf859cf6-h67cz
2020-03-03T12:49:19.087Z [MASTER] info: =======================================
2020-03-03T12:49:19.088Z [MASTER] info: = Wiki.js 2.1.113 =====================
2020-03-03T12:49:19.089Z [MASTER] info: =======================================
2020-03-03T12:49:19.089Z [MASTER] info: Initializing...
2020-03-03T12:49:19.322Z [MASTER] info: Using database driver pg for postgres [ OK ]
2020-03-03T12:49:19.326Z [MASTER] info: Connecting to database...
2020-03-03T12:49:20.377Z [MASTER] error: Database Connection Error: ECONNREFUSED 10.100.25.5:5432
2020-03-03T12:49:20.378Z [MASTER] warn: Will retry in 3 seconds... [Attempt 1 of 10]
2020-03-03T12:49:23.382Z [MASTER] info: Connecting to database...
2020-03-03T12:49:24.427Z [MASTER] info: Database Connection Successful [ OK ]
2020-03-03T12:49:25.567Z [MASTER] warn: Mail is not setup! Please set the configuration in the administration area!
```

We can see here that the connection to the base has worked, and that we can access the admin page for an initial configuration.

Now try to connect from your host machine to the wiki. Depending on the hostname to use in your ingress don't forget to update your hosts file to point the domain to 127.0.0.1.

```powershell
127.0.0.1 my-awesome-wiki.fr
```

Finally, try to access the following url "http://my-awesome-wiki.fr:8080" If everything has been set up correctly, you should arrive at the wiki configuration page, and your wiki should be up and running.