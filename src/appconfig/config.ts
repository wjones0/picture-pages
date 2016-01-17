export class AuthConfigSecrets {

	twitter: AuthTwitter = new AuthTwitter();
	facebook: AuthFacebook = new AuthFacebook();
	google: AuthGoogle = new AuthGoogle();
	mongodb: ConfigMongoDB = new ConfigMongoDB();
	session: ConfigSession = new ConfigSession();
}

export class AuthTwitter {
	consumer_key: string = process.env.TWITTER_CONSUMERKEY;
	consumer_secret: string = process.env.TWITTER_SECRET;
	callback_URL: string = process.env.TWITTER_CALLBACK_URL;
}

export class AuthFacebook {
	client_ID: string = process.env.FACEBOOK_CLIENTID;
	client_secret: string = process.env.FACEBOOK_SECRET;
	callback_URL: string = process.env.FACEBOOK_CALLBACK_URL;
}

export class AuthGoogle {
	client_ID: string = process.env.GOOGLE_CLIENTID;
	client_secret: string = process.env.GOOGLE_SECRET;
	callback_URL: string = process.env.GOOGLE_CALLBACK_URL;

}

export class ConfigMongoDB {
	connection: string = process.env.MONGO_CONN;
}

export class ConfigSession {
	session_secret: string = process.env.SESSION_SEC;
}

export class ConfigAmazonS3 {
    access_key: string = process.env.AMAZONS3_ACCESS_KEY;
    secret_key: string = process.env.AMAZONS3_SECRET_KEY;
    bucket: string = process.env.AMAZONS3_BUCKET;
}