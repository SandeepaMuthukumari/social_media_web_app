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
                checkout scm
                sh "ls -la"  // Debugging: Check if repo is cloned correctly
            }
        }

        stage("Locate and Build Application") {
            steps {
                script {
                    def pomPath = sh(script: "find . -name pom.xml | head -n 1", returnStdout: true).trim()
                    if (pomPath) {
                        def projectDir = pomPath.replace("/pom.xml", "")
                        echo "Found pom.xml in: ${projectDir}"
                        sh "cd ${projectDir} && mvn clean package"
                    } else {
                        error "pom.xml not found! Check the repository structure."
                    }
                }
            }
        }

        stage("Test Application") {
            steps {
                script {
                    def pomPath = sh(script: "find . -name pom.xml | head -n 1", returnStdout: true).trim()
                    if (pomPath) {
                        def projectDir = pomPath.replace("/pom.xml", "")
                        echo "Running tests in: ${projectDir}"
                        sh "cd ${projectDir} && mvn test"
                    } else {
                        error "Cannot run tests, pom.xml not found!"
                    }
                }
            }
        }
    }
}




