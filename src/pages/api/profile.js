import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: process.env.AWS_REGION});
const ddbDocClient = DynamoDBDocumentClient.from(client);

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { name, email, avatarUrl } = req.body;

        const params = {
            TableName: "Users",
            Item: {
                email: email,
                name: name,
                avatarUrl: avatarUrl,
            }
        }

        try {
            await ddbDocClient.send(new PutCommand(params));
            res.status(200).json({ message: "Profile saved successfully!"});
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error saving profile", error})
        }
    } else if (req.method === "GET") {
        const {email} = req.query;

        const params = {
            TableName: "Users",
            key: {
                email: email,
            },
        };

        try {
            const data = await ddbDocClient.send(new GetCommand(params));
            if (data.Item) {
                res.status(200).json(data.Item);
            } else {
                res.status(404).json ({ message: "Profile not found" })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error fetching profile", error});
        }
    } else {
        res.status(405).json ({ message: "Method not allowed" })
    }
}