export class AuthConfigSecrets {

	twitter: AuthTwitter = new AuthTwitter();
	facebook: AuthFacebook = new AuthFacebook();
	google: AuthGoogle = new AuthGoogle();
	mongodb: ConfigMongoDB = new ConfigMongoDB();
	session: ConfigSession = new ConfigSession();
}

export class AuthTwitter {
	consumer_key: string = '';
	consumer_secret: string = '';
	callback_URL: string = 'http://localhost:8080/auth/twitter/callback';
}

export class AuthFacebook {
	client_ID: string = '';
	client_secret: string = '';
	callback_URL: string = 'http://localhost:8080/auth/facebook/callback';
}

export class AuthGoogle {
	client_ID: string = '';
	client_secret: string = '';
	callback_URL: string = 'http://localhost:8080/auth/google/callback';

}

export class ConfigMongoDB {
	connection: string = '';
}

export class ConfigSession {
	session_secret: string = '';
}

