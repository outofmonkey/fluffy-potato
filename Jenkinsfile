pipeline {
	agent any

	stages {
		stage("Fetch Code") {
			steps {
				git branch: 'main', url: 'https://github.com/outofmonkey/fluffy-potato.git'
			}
		}
		stage("Install Dep") {
			steps {
				sh '''sudo apt update
                sudo apt install apache2 -y'''
			}
		}
		stage("Deploy App") {
			steps {
				sh 'sudo cp -R * /var/www/html/'
			}
		}
	}
}