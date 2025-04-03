pipeline {
    agent {
        label 'docker-agent' // Use a dedicated agent with sufficient resources
        docker {
            image 'node:20-alpine'
            args '-v /var/run/docker.sock:/var/run/docker.sock --memory 4g'
        }
    }

    tools {
        nodejs 'NodeJS20'
    }

    environment {
        APP_NAME = "social-media-web-app-pipeline"
        RELEASE = "1.0.0"
        IMAGE_NAME = "sandeepadocker/${APP_NAME}"
        IMAGE_TAG = "${RELEASE}.${BUILD_NUMBER}" // Improved version format
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

        stage('Audit Fix') {
            when { 
                expression { return env.BRANCH_NAME == 'main' } 
            }
            steps {
                sh 'npm audit fix'
            }
        }

        stage('Build Application') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Setup Docker Buildx') {
            steps {
                sh 'docker buildx install' // Address deprecation warning
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub1', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                        sh "docker buildx build --push -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest ."
                    }
                }
            }
        }

        stage('Trivy Scan') {
            steps {
                script {
                    sh '''docker run --rm \
                        -v /var/run/docker.sock:/var/run/docker.sock \
                        -v /tmp/trivy-cache:/tmp/trivy-cache \
                        -e TRIVY_CACHE_DIR=/tmp/trivy-cache \
                        aquasec/trivy:latest \
                        image --security-checks vuln \
                        --severity HIGH,CRITICAL \
                        --no-progress \
                        --exit-code 0 \
                        --format table \
                        ${IMAGE_NAME}:latest'''
                }
            }
        }
    }

 
}
