pipeline {
    agent any

    tools {
        nodejs 'NodeJS20'
    }

    environment {
        APP_NAME = "social-media-web-app-pipeline"
        RELEASE = "1.0.0"
        IMAGE_NAME = "sandeepadocker/${APP_NAME}"
        IMAGE_TAG = "${RELEASE}-${BUILD_NUMBER}"
        AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
        CONTAINER_NAME = "${APP_NAME}-container"
        HOST_PORT = "3000"  // Change this to your application's port
        CONTAINER_PORT = "3000"  // Change this to match your Dockerfile EXPOSE
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
                    withCredentials([usernamePassword(credentialsId: 'dockerhub1', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                        sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                        sh "docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${IMAGE_NAME}:latest"
                        sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                        sh "docker push ${IMAGE_NAME}:latest"
                    }
                }
            }
        }

        stage("Trivy Scan") {
            steps {
                script {
                    sh ('docker run -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image sandeepadocker/social-media-web-app-pipeline:latest --no-progress --scanners vuln --exit-code 0 --severity HIGH,CRITICAL --format table')
                }
            }
        }

        stage('Run Application') {
            steps {
                script {
                    // Stop and remove any existing container with the same name
                    sh "docker stop ${CONTAINER_NAME} || true"
                    sh "docker rm ${CONTAINER_NAME} || true"
                    
                    // Run the new container
                    sh """
                        docker run -d \
                        --name ${CONTAINER_NAME} \
                        -p ${HOST_PORT}:${CONTAINER_PORT} \
                        -e NODE_ENV=production \
                        ${IMAGE_NAME}:latest
                    """
                    
                    // Verify container is running
                    sh "docker ps -f name=${CONTAINER_NAME}"
                    
                    // Optional: Add health check
                    sh "sleep 10" // Wait for app to start
                    sh "curl -I http://localhost:${HOST_PORT} || true"
                }
            }
        }

        stage('Cleanup Artifacts') {
            steps {
                script {
                    sh "docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || true"
                    sh "docker rmi ${IMAGE_NAME}:latest || true"
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution completed'
            // Optional: Add cleanup of containers in post-failure
        }
        success {
            echo 'Application deployed successfully!'
            // Optional: Add notification here
        }
        failure {
            echo 'Pipeline failed! Check logs for details.'
            // Optional: Add failure notification here
        }
    }
}
