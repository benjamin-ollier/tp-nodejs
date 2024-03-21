import { DataSource } from "typeorm";
import { Livre } from "../database/entities/livre";

export interface ListLivreFilter {
    prix: number
    nbTome: number
}

export interface UpdateLivreParams {
    nbTome?: number
    note?: number
}

interface RechercheLivreParams {
    prixMin?: number;
    prixMax?: number;
    nbTomeMin?: number;
    nbTomeMax?: number;
}

export class LivreUsecase {
    constructor(private readonly db: DataSource) { }

    async updateLivre(id: number, { nbTome, note }: UpdateLivreParams): Promise<Livre | null> {
        const repo = this.db.getRepository(Livre)
        const livrefound = await repo.findOneBy({ id })
        if (livrefound === null) return null

        if (note) {
            livrefound.note = note
        }

        if (nbTome) {
            livrefound.nbTome = nbTome
        }

        const livreUpdate = await repo.save(livrefound)
        return livreUpdate
    }

    //get livre by nom
    async findByName(nom: string){
        const repo = this.db.getRepository(Livre);

        const livres = await repo.createQueryBuilder("livre")
                                .where("livre.nom LIKE :nom", { nom: `%${nom}%` })
                                .getMany();

        return livres;
    }

    async findByMultiplesName(noms: string[]): Promise<Livre[]> {
        const repo = this.db.getRepository(Livre);
    
        const livres = await repo.createQueryBuilder("livre")
                                 .where("livre.nom IN (:...noms)", { noms })
                                 .getMany();
    
        return livres;
    }

    async rechercherLivresFiltre(params: RechercheLivreParams): Promise<Livre[]> {
        const repo = this.db.getRepository(Livre);
        let query = repo.createQueryBuilder("livre");
    
        if (params.prixMin !== undefined) {
            query = query.andWhere("livre.prix >= :prixMin", { prixMin: params.prixMin });
        }
    
        if (params.prixMax !== undefined) {
            query = query.andWhere("livre.prix <= :prixMax", { prixMax: params.prixMax });
        }
    
        if (params.nbTomeMin !== undefined) {
            query = query.andWhere("livre.nbTome >= :nbTomeMin", { nbTomeMin: params.nbTomeMin });
        }
    
        if (params.nbTomeMax !== undefined) {
            query = query.andWhere("livre.nbTome <= :nbTomeMax", { nbTomeMax: params.nbTomeMax });
        }
    
        return query.getMany();
    }
}