pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "nexus-task-manager"
        CONTAINER_NAME = "task-manager-prod"
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout code from GitHub (usually handled by Jenkins job)
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${DOCKER_IMAGE}:latest ."
                }
            }
        }

        stage('Stop Old Container') {
            steps {
                script {
                    try {
                        sh "docker stop ${CONTAINER_NAME}"
                        sh "docker rm ${CONTAINER_NAME}"
                    } catch (Exception e) {
                        echo "No existing container to stop."
                    }
                }
            }
        }

        stage('Deploy Updated Container') {
            steps {
                script {
                    sh "docker run -d --name ${CONTAINER_NAME} -p 5000:5000 ${DOCKER_IMAGE}:latest"
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline completed successfully! Application is live."
        }
        failure {
            echo "Pipeline failed. Check logs for details."
        }
    }
}
