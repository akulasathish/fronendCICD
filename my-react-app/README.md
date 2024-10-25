/////////////////this is sample jenkins pipeline script/////////


pipeline {
    agent any

    stages {
        stage('Clone Repository') {
            steps {
                git url: 'https://github.com/your-username/my-react-app.git',
                    credentialsId: '3d0cda11-15ad-4126-b6f5-8677e4df4670', // GitHub credentials
                    branch: 'main'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t akulasathish1997/react-deploy .'
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    // Log in to Docker Hub
                    withCredentials([usernamePassword(credentialsId: '3d0cda11-15ad-4126-b6f5-8677e4df4670', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_TOKEN')]) {
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
                    sh 'docker pull akulasathish1997/react-deploy'
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
