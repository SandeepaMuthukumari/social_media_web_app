pipeline {
    agent any

    tools {
        nodejs 'NodeJS20'  // Match the configured name in Jenkins
    }

    environment {
        APP_NAME = "social-media-web-app-pipeline"
        RELEASE = "1.0.0"
        DOCKER_USER = "sandeepadocker"
        DOCKER_PASS = credentials('dockerhub')  // Ensure this matches the ID in Jenkins credentials store
        IMAGE_NAME = "${DOCKER_USER}/${APP_NAME}"
        IMAGE_TAG = "${RELEASE}-${BUILD_NUMBER}"
    }

    stages {
        stage('Check Node Version') {
            steps {
                sh 'node -v'
                sh 'npm -v'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Application') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                script {
                    // Login to Docker registry and build the image
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_PASS) {
                        docker_image = docker.build("${IMAGE_NAME}")
                    }

                    // Push the image with the tag and 'latest'
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_PASS) {
                        docker_image.push("${IMAGE_TAG}")
                        docker_image.push('latest')
                    }
                }
            }
        }
    }
}









