# backend/usuarios/views.py - ADICIONE ESTE CÓDIGO AO FINAL

from rest_framework.permissions import IsAuthenticated # Importe o IsAuthenticated
from .serializers import UserSerializer # Importe o novo UserSerializer

# ... sua classe RegistroView continua aqui em cima ...

# View para retornar os dados do usuário atualmente logado
class CurrentUserView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated] # Apenas usuários autenticados podem acessar
    serializer_class = UserSerializer

    def get_object(self):
        # A mágica acontece aqui: em vez de buscar um usuário pelo ID,
        # simplesmente retornamos o 'request.user', que o Django já
        # sabe quem é, graças ao token de autenticação.
        return self.request.user