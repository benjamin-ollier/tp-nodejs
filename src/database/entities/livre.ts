import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity()
export class Livre {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nom: string

    @Column()
    nbTome: number

    @Column()
    auteur: string

    @Column()
    prix: number

    @Column()
    note: number

    constructor(id: number, nom: string, nbTome: number, auteur: string, prix: number, note: number) {
        this.id = id;
        this.nom = nom; 
        this.nbTome = nbTome;
        this.auteur = auteur;
        this.prix = prix;
        this.note = note;
    }
}