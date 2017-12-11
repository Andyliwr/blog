pipeline {
  agent {
    docker {
      image 'node'
    }
    
  }
  stages {
    stage('build') {
      steps {
        echo 'asdasd'
        sh 'ls && node -v && npm install -g cnpm --registry=https://registry.npm.taobao.org'
      }
    }
  }
}