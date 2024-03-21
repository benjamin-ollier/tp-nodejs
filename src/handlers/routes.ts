import express, { Request, Response } from "express";
import { listLivreValidation as listLivresValidation, livreIdValidation,livresNomsValidation, livreNomValidation, LivreRequest, livreValidation, updateLivreValidation } from "./validators/livre-validator";
import { generateValidationErrorMessage } from "./validators/generate-validation-message";
import { AppDataSource } from "../database/database";
import { Livre } from "../database/entities/livre";
import { LivreUsecase } from "../domain/livre-usecase";

export const initRoutes = (app: express.Express) => {
    app.get("/health", (req: Request, res: Response) => {
        res.send({ "message": "hello world" })
    })

    app.post("/livres", async (req: Request, res: Response) => {
        const validation = livreValidation.validate(req.body)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const livreRequest = validation.value
        const livreRepo = AppDataSource.getRepository(Livre)
        try {

            const livreCreated = await livreRepo.save(
                livreRequest
            )
            res.status(201).send(livreCreated)
        } catch (error) {
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.get("/livres/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = livreIdValidation.validate(req.params)

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details))
                return
            }
            const livreId = validationResult.value

            const livreRepository = AppDataSource.getRepository(Livre)
            const livre = await livreRepository.findOneBy({ id: livreId.id })
            if (livre === null) {
                res.status(404).send({ "error": `livre ${livreId.id} not found` })
                return
            }
            res.status(200).send(livre)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.get("/livres/name/:nom", async (req: Request, res: Response) => {
        try {
            const validationResult = livreNomValidation.validate(req.params)

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details))
                return
            }
            const livreNom = validationResult.value

            const livreUsecase = new LivreUsecase(AppDataSource);
            const livre = await livreUsecase.findByName(livreNom.nom)
            if (livre === null) {
                res.status(404).send({ "error": `list livres ${livreNom.nom} not found` })
                return
            }
            res.status(200).send(livre)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.get("/livres/names", async (req: Request, res: Response) => {
        try {
            const validationResult = livresNomsValidation.validate(req.body);
    
            // if (validationResult.error) {
            //     res.status(400).send(generateValidationErrorMessage(validationResult.error.details));
            //     return;
            // }
            const { noms } = validationResult.value;
    
            const livreUsecase = new LivreUsecase(AppDataSource);
            const livres = await livreUsecase.findByMultiplesName(noms);
    
            if (livres.length === 0) {
                res.status(404).send({ "error": "No matching books found" });
                return;
            }
    
            res.status(200).send(livres);
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "Internal error" });
        }
    })

    app.get("/livres/filter", async (req: Request, res: Response) => {
        try {
            const livreUsecase = new LivreUsecase(AppDataSource);
            const livre = await livreUsecase.rechercherLivresFiltre({...req.body})
            if (livre === null) {
                res.status(404).send({ "error": `list livres not found` })
                return
            }
            res.status(200).send(livre)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.delete("/livres/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = livreIdValidation.validate(req.params)

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details))
                return
            }
            const livreId = validationResult.value

            const livreRepository = AppDataSource.getRepository(Livre)
            const livre = await livreRepository.findOneBy({ id: livreId.id })
            if (livre === null) {
                res.status(404).send({ "error": `livre ${livreId.id} not found` })
                return
            }

            const livreDeleted = await livreRepository.remove(livre)
            res.status(200).send(livreDeleted)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })


    app.patch("/livres/:id", async (req: Request, res: Response) => {

        const validation = updateLivreValidation.validate({ ...req.params, ...req.body })

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const updateLivreRequest = validation.value

        try {
            const livreUsecase = new LivreUsecase(AppDataSource);
            const updatedLivre = await livreUsecase.updateLivre(updateLivreRequest.id, { ...updateLivreRequest })
            if (updatedLivre === null) {
                res.status(404).send({ "error": `livre ${updateLivreRequest.id} not found` })
                return
            }
            res.status(200).send(updatedLivre)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })
}