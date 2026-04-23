pipeline {
    agent any

    environment {
        APP_NAME       = 'devops-demo'
        APP_PORT       = '3001'         // 3000 is taken by your compose apps
        CONTAINER_NAME = "${APP_NAME}-dev"
        IMAGE_NAME     = "jenkins-built/${APP_NAME}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
                echo "Branch: ${env.BRANCH_NAME} | Build: #${env.BUILD_NUMBER}"
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                // No test script defined in package.json yet
                // This stage is a placeholder — add real tests later
                echo 'No tests defined yet — skipping'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    docker build -t ${IMAGE_NAME}:${env.BUILD_NUMBER} .
                    docker tag ${IMAGE_NAME}:${env.BUILD_NUMBER} ${IMAGE_NAME}:latest
                """
            }
        }

        stage('Deploy to Dev') {
            steps {
                sh """
                    # Stop and remove previous dev container only
                    docker stop ${CONTAINER_NAME} || true
                    docker rm   ${CONTAINER_NAME} || true

                    # Run fresh dev container on port 3001
                    # Completely separate from your compose containers
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        -p ${APP_PORT}:3000 \
                        -e APP_NAME=dev-build \
                        -e TZ=Asia/Karachi \
                        --restart unless-stopped \
                        ${IMAGE_NAME}:latest
                """
                echo "Dev build live → http://localhost:${APP_PORT}"
            }
        }

        stage('Clean Old Images') {
            steps {
                sh """
                    # SAFE: only removes older jenkins-built images for THIS app
                    # Never touches your docker-compose images
                    docker images --format '{{.Repository}}:{{.Tag}} {{.ID}}' \
                        | grep '^${IMAGE_NAME}:' \
                        | grep -v ':latest' \
                        | grep -v ':${env.BUILD_NUMBER}' \
                        | awk '{print \$2}' \
                        | xargs -r docker rmi || true
                """
            }
        }
    }

    post {
        success {
            echo "SUCCESS — http://localhost:${APP_PORT} is running build #${env.BUILD_NUMBER}"
        }
        failure {
            echo "FAILED — compose containers untouched, check logs above"
        }
    }
}