pipeline {
    agent { label 'Jenkins-Agent' }
    tools {
        jdk 'Java17'
        maven 'Maven3'
    }

    stages {
        stage("Cleanup Workspace") {
            steps {
                cleanWs()
            }
        }

        stage("Checkout from SCM") {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: 'https://github.com/SandeepaMuthukumari/social_media_web_app',
                        credentialsId: 'github'
                    ]]
                ])
            }
        }

        stage("Verify Checkout") {
            steps {
                sh "ls -l"
            }
        }

        stage("Build Application") {
            steps {
                script {
                    def pomExists = sh(script: "test -f pom.xml && echo 'FOUND'", returnStdout: true).trim()
                    if (pomExists == 'FOUND') {
                        sh "mvn clean package"
                    } else {
                        error "pom.xml not found! Check the repository structure."
                    }
                }
            }
        }

        stage("Test Application") {
            steps {
                sh "mvn test"
            }
        }
    }
}

