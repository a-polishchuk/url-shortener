import { MongoClient } from "mongodb";
import { logger } from './logger';

let client: MongoClient;

export async function getMongoClient() {
    if (client) {
        return client;
    }

    try {
        client = new MongoClient(getConnectionUri());
        await client.connect();
        logger.info('connection to mongodb established');
    } catch (err) {
        logger.error(err, 'cannot establish connection to mongodb');
    }

    return client;
}

function getConnectionUri() {
    const username = process.env.MONGO_USERNAME;
    const password = process.env.MONGO_PASSWORD;
    return `mongodb+srv://${username}:${password}@devcluster.7ho7i.mongodb.net/?retryWrites=true&w=majority&appName=DevCluster`;
}

// cleanup resources, close db connection on process termination
process.on('SIGINT', () => {
    client.close()
        .then(() => logger.info("mongodb connection closed"))
        .catch((err) => logger.error(err, 'error on closing mongodb connection'));

    // we have to explicitly exit the process, 
    // express.js web server will run forever if we don't do exit()
    process.exit(0);
});