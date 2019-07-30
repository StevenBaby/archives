# Kafka 的一些笔记

[annotation]: <id> (64141d15-ad59-4b47-a7a6-4a7db241d865)
[annotation]: <status> (public)
[annotation]: <create_time> (2019-05-14 11:32:17)
[annotation]: <category> (计算机技术)
[annotation]: <tags> (Kafka)
[annotation]: <comments> (true)


## 查看 TOPIC 消费情况

```sh
./bin/kafka-run-class.sh kafka.tools.ConsumerOffsetChecker --zookeeper 192.168.1.1:2181,192.168.1.2:2181,192.168.1.3:2181 --group consume_group --topic topic_name
```

其中:

- `192.168.1.1:2181,192.168.1.2:2181,192.168.1.3:2181` 是 Zookeeper 的相关地址。
- `consume_group` 是消费组名
- `topic_name` 是topic的名字

## 消息过大

修改 `server.properties`:

```ini
# broker能接收消息的最大字节数
message.max.bytes=20000000
# broker可复制的消息的最大字节数
fetch.message.max.bytes=20485760
```
