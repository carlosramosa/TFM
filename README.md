# Arquitectura Big Data para dispositivos IoT

![alt text](diagrama.png)

## Puesta en marcha de Kafka, ElasticSearch & MongoDB

### Kafka

Para comenzar levantaremos los de Kafka. Para ello, usaremos un docker-compose extraido de la página web de Confluent, con una serie de servicios, entre ellos Kafka o el Centro de Control de Confluent.
El Centro de Control Confluent es una herramienta que proporciona una serie de facilidades para configurar Kafka y los datos que fluyen a través de él. El Centro de Control nos brinda al administrador capacidades de monitoreo y administración a través de paneles de control.

Para poner en marcha todo esto, ejecutaremos el script:

```
npm run start-kafka
```

Esto pondrá en marcha los siguientes servicios:
- ZooKeeper
- Broker de Kafka
- Conector de Kafka para DataGen
- Confluent Control Center
- KSQL Server
- KSQL CLI
- KSQL DataGen
- Un proxy REST
- Schema Registry

### ElasticSearch y MongoDB

A continuación, arrancaremos los servicios de ElasticSearch, Kibana, Cerebro y MongoDB.

Kibana lo utilizaremos para observar métricas y analizar los datos existentes en ElasticSearch.

Cerebro es una herramienta a través de la cual podremos visualizar y modificar todos los aspectos de configuración del cluster de ElasticSearch, como sus mappings, estado de los nodos, ejecutar consultas, eliminar índices, etc..

Para arrancar todo, ejecutaremos el siguiente script:
```
npm run start-elastic-mongo
```

### Utilidades

Para ver el estado de nuestros contenedores docker, bastará con ejecutar el siguiente comando:
```
npm run docker-ps
```

Para pararr todos nuestros contenedores docker, ejecutaremos la siguiente instrucción:
```
npm run docker-stop
```

## Productor

Para iniciar el productor, tendremos que ejecutar la instrucción:
```
npm run productor
```

## Consumidores

### Multiplexador
El multiplexador multiplexa los mensajes emitidos por el productor y los envía a los topics `to-elastic`, `to-mongo` y `to-alerts`.
Para iniciar el multiplexador, ejecutaremos la instrucción:
```
npm run multiplexer
```

### MongoDB
El consumidor de mongo introducirá en MongoDB todos los mensajes que reciba del multiplexador. Los documentos introducidos tendrán tres campos: `test`, `timestamp`y `value`.


### ElasticSearch
El consumidor de elastic introducirá en ElasticSearch todos los mensajes que reciba del multiplexador. Los documentos introducidos tendrán tres campos: `test`, `date`y `value`.


### Alertas
Las alertas tienen dos funcionalidades.

Por un lado, nos avisarán cuando el valor medio llegue a un umbral determinado en un periodo mínimo de tiempo.

Por otro lado, cada cierto número de mensajes, nos comunicará el valor medio de los documentos hasta ese instante.

Existen las siguientes variables de entorno:
- `TTL`: Es el tiempo mínimo que vamos a dejar de margen para que se genere una media fiable con las muestras suficientes para poder tener en cuenta su valor medio para generar una alerta. Su valor es en milisegundos.
- `COUNT`: número de documentos necesarios para notificar una alerta y comprobar el estado de la media de los valores
- `THRESHOLD`: valor con el que valor a comparar la media para decidir si se genera una alerta o no.
- `COMPARATOR`: operador de comparación para operar sobre el valor. Sus valores posibles son `GT`, `GTE`, `LT` y `LTE`.

Un ejemplo de configuración sería:
```
TTL = 10 * 1000;
COUNT = 20;
THRESHOLD = 100;
OPERATOR = 'GT';
```
En este caso, se dejaría un tiempo de margen de 10 segundos para que se empiecen a examinar los documentos para generar alertas, y en caso de que la media sea mayor de 100, se generá una alerta y todos los valores se pondrán a 0.
Por otro lado, cada 20 documentos nos informará de la media actual. 