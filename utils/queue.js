import amqplib from 'amqplib';

export async function publish_product(details, topic) {
    const RABBITMQ_URL = 'amqp://localhost:5672';
    const EXCHANGE_NAME = 'product_exchange';
    
    try {
        const connection = await amqplib.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();

        await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });

        const message = JSON.stringify(details);

        channel.publish(EXCHANGE_NAME, topic, Buffer.from(message));

        console.log(`Message published to topic '${topic}':`, details);

        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Error publishing message to RabbitMQ:', error);
    }
}