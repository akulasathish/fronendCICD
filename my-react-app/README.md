pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                git url: 'https://github.com/akulasathish/fronendCICD.git',
                    credentialsId: 'git-hub-credentials', // GitHub credentials
                    branch: 'master'
            }
        }

        stage('List Workspace') {
            steps {
                sh 'ls -R'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image using the correct Dockerfile path
                    sh 'docker build -t akulasathish1997/react-deploy -f my-react-app/Dockerfile my-react-app'
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    // Log in to Docker Hub
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_TOKEN')]) {
                        sh 'docker login -u $DOCKER_USERNAME -p $DOCKER_TOKEN'
                        sh 'docker push akulasathish1997/react-deploy'
                    }
                }
            }
        }

        stage('Deploy React App') {
            steps {
                script {
                    echo 'Deploying the React app...'
                    // Stop and remove the previous container, if any
                    sh '''
                    CONTAINER_ID=$(docker ps -q --filter ancestor=akulasathish1997/react-deploy)
                    if [ ! -z "$CONTAINER_ID" ]; then
                        docker stop $CONTAINER_ID
                        docker rm $CONTAINER_ID
                    fi
                    '''

                    // Run the new container
                    sh 'docker run -d -p 80:80 akulasathish1997/react-deploy'
                }
            }
        }
    }

    post {
        failure {
            echo 'Pipeline failed. Please check the logs for more details.'
        }
    }
}
