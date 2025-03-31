pipeline {
    agent { label 'Jenkins-Agent' }
    
    tools {
        nodejs 'NodeJS18' // Ensure Node.js is installed in Jenkins
    }

    stages {
        stage("Cleanup Workspace") {
            steps {
                cleanWs()
            }
        }

        stage("Checkout from SCM") {
            steps {
                git branch: 'main', credentialsId: 'github', url: 'https://github.com/SandeepaMuthukumari/social_media_web_app'
            }
        }

        stage("Install Dependencies") {
            steps {
                sh 'npm install'
            }
        }

        stage("Build Application") {
            steps {
                sh 'npm run build'
            }
        }

        stage("Test Application") {
            steps {
                sh 'npm test'
            }
        }
    }
}





