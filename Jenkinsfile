pipeline {
    agent { label 'Jenkins-Agent' }
    tools {
        jdk 'Java17'
        maven 'Maven3'
    }
   
    stages{
        stage("Cleanup Workspace"){
                steps {
                cleanWs()
                }
        }

        stage("Checkout from SCM"){
                steps {
                    git branch: 'main', credentialsId: 'github', url: 'https://github.com/SandeepaMuthukumari/social_media_web_app'
                }
        }

        stage("Build Application"){
                steps {
                    sh "mvn -f social_media_web_app/pom.xml clean package"
                }
        }

       stage("Test Application"){
           steps {
                 sh "mvn test"
           }
       }
    }      
}
