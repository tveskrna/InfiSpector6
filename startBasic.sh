#!/bin/bash

export KAFKA_OPTS="-Dfile.encoding=UTF-8"

cleanUp() {
	
	kill -9 $KAFKA_PID
	kill -9 $DRUID_PID

	pids=($(jps -l | grep -i -E "druid|zookeeper" | cut -d' ' -f1))
	
	for i in "${pids[@]}"
	do
		kill -9 $i
	done

	#Clear Druid data
	rm -rf "$DRUID_LOCATION/var/"	
	
}

DRUID_LOCATION="/home/tveskrna/projects/tveskrna/dipp/apache-druid-0.13.0-incubating"
KAFKA_LOCATION="/home/tveskrna/projects/tveskrna/dipp/kafka_2.11-2.1.0"
FILES_LOCATION=`pwd`

cd $DRUID_LOCATION
printf "Starting Druid and Zookeeper ... \n"
# This starts 1 process and 5 java process. It is important kill normal process at first.
bin/supervise -c quickstart/tutorial/conf/tutorial-cluster.conf > /dev/null &
sleep 10 
printf "Started \n"

DRUID_PID=$!

cd $KAFKA_LOCATION
printf "Starting Kafka ...\n"
# It is impportant to kill Kafka process before Druid
bin/kafka-server-start.sh config/server.properties > /dev/null &
sleep 15 
printf "Started \n"

KAFKA_PID=$!

printf "Create topic on Kafka ... \n"
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic infispector-kafka &
sleep 10

printf "Setting druid spec file ... \n"
curl -XPOST -H'Content-Type: application/json' -d "@$FILES_LOCATION/infispector-kafka-supervisor.json" http://localhost:8090/druid/indexer/v1/supervisor

if [ $? -ne 0 ]
	then
		cleanUp
		exit 1
fi

sleep 30

printf "\nSending testing data to Kafka ...\n"
bin/kafka-console-producer.sh --broker-list localhost:9092 --topic infispector-kafka < "$FILES_LOCATION/infinispan-example.json" &
sleep 15

printf "\nResult of query: \n"
curl -XPOST -H'Content-Type: application/json' -d "@$FILES_LOCATION/infispector-query.json" "http://localhost:8082/druid/v2?pretty"

if [ $? -ne 0 ]
	then
		cleanUp
		exit 1
fi 

sleep 1

echo -e "\n"

read -p "Waiting ... Press enter and kill process"

cleanUp
exit 0
