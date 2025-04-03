pipeline {
    agent any

    tools {
        nodejs 'NodeJS20'
        // Add Terraform tool if you have it configured in Jenkins
        terraform 'terraform' 
    }

    environment {
        APP_NAME = "social-media-web-app-pipeline"
        RELEASE = "1.0.0"
        IMAGE_NAME = "sandeepadocker/${APP_NAME}"
        IMAGE_TAG = "${RELEASE}-${BUILD_NUMBER}"
        // Add Terraform variables
        TF_VAR_image_name = "${IMAGE_NAME}"
        TF_VAR_image_tag = "${IMAGE_TAG}"
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
                    sh ('docker run -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image sandeepadocker/social-media-web-app-pipeline:latest --no-progress --scanners vuln  --exit-code 0 --severity HIGH,CRITICAL --format table')
               }
           }
       }

        stage('Terraform Deploy') {
            steps {
                script {
                    dir('terraform') {  // Assuming your Terraform files are in a 'terraform' directory
                        // Initialize Terraform
                        sh 'terraform init'
                        
                        // Plan the changes
                        sh 'terraform plan -out=tfplan'
                        
                        // Apply the changes (auto-approve for CI/CD)
                        sh 'terraform apply -auto-approve tfplan'
                    }
                }
            }
        }

        stage ('Cleanup Artifacts') {
           steps {
               script {
                    sh "docker rmi ${IMAGE_NAME}:${IMAGE_TAG}"
                    sh "docker rmi ${IMAGE_NAME}:latest"
               }
          }
       }
    }
}
