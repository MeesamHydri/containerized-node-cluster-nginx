pipeline {
    agent any

    environment {
        APP_NAME    = 'devops-demo'
        IMAGE_NAME  = "jenkins-built/${APP_NAME}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
                echo "Branch: ${env.BRANCH_NAME} | Build: #${env.BUILD_NUMBER}"
            }
        }

        stage('Build Images') {
            steps {
                sh """
                    # Only builds dev profile images
                    # Production images are never touched
                    docker-compose -f docker-compose.dev.yml build
                """
            }
        }

        stage('Deploy Dev Stack') {
            steps {
                sh """
                    # Stop and remove old dev stack only
                    docker-compose -f docker-compose.dev.yml down

                    # Start fresh dev stack
                    docker-compose -f docker-compose.dev.yml up -d
                """
                echo "Dev stack deployed → http://localhost:9080"
            }
        }

        stage('Verify') {
            steps {
                sh """
                    sleep 5
                    echo "=== Dev containers status ==="
                    docker-compose -f docker-compose.dev.yml ps

                    echo "=== Production containers status (should be unchanged) ==="
                    docker-compose -f docker-compose.yml ps
                """
            }
        }

    }

    post {
        success {
            echo """
                SUCCESS — Build #${env.BUILD_NUMBER}
                Dev environment  → http://localhost:9080
                Dev API          → http://localhost:9080/api
                Dev Admin        → http://localhost:9080/admin
                Production       → http://localhost (untouched)
            """
        }
        failure {
            echo "FAILED — Production stack untouched. Check logs above."
        }
    }
}