// Vous devez insérer les nouveaux tests ici
import { assert } from 'console';
import 'jest-extended';
import app from '../../src/app';
import supertest from 'supertest';
import { jeuRoutes } from '../../src/routes/jeuRouter';

const request = supertest(app);

const testNom1 = 'Jean-Marc';
const testNom2 = 'Pierre';

beforeAll(async () => {
    // initialliser le jeu avec deux joueurs 
    await request.post('/api/v1/jeu/demarrerJeu').send({ nom: testNom1 });
    await request.post('/api/v1/jeu/demarrerJeu').send({ nom: testNom2 });
  });

describe('GET /api/v1/jeu/redemarrerJeu', () => {

  //vérifier que le jeu à été redémarré pour joueur1
  it(`devrait répondre avec succès pour redémarrer le jeu pour joueur ${testNom1}`, async () => {
    const response = await request.get('/api/v1/jeu/redemarrerJeu');
    expect(response.status).toBe(200);
    expect(response.type).toBe("application/json");
  });

  //vérifier que le jeu à été redémarré pour joueur2
  it(`devrait répondre avec succès pour redémarrer le jeu pour joueur ${testNom2}`, async () => {
    const response = await request.get('/api/v1/jeu/redemarrerJeu');
    expect(response.status).toBe(200);
    expect(response.type).toBe("application/json");
  });

  //vérifier qu'il n'y a plus de joueurs dans le jeu
  it('devrait rendre 0 pour le nombre de Joueurs après que nous avons redémarré le jeu', async () => {
    const joueursJSON = jeuRoutes.controleurJeu.joueurs;
    const joueursArray = JSON.parse(joueursJSON);
    expect(joueursArray.length).toBe(0);
  });

  //vérifier que le jeu a été redémarré et qu'on ne peut plus jouer avec un joueur inexistant
  it('devrait retourner 404 quand on essaie de jouer après avoir redémarré le jeu', async () => {
  // Redémarre le jeu
  let response = await request.get('/api/v1/jeu/redemarrerJeu');
  expect(response.status).toBe(200);
  expect(response.type).toBe("application/json");

  // Essayer de jouer avec un joueur inexistant
  response = await request.post(`/api/v1/jeu/jouer/ ${testNom1}`);
  expect(response.status).toBe(404);
});

});
