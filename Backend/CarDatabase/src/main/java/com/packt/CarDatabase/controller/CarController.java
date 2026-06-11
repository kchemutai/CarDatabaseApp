package com.packt.CarDatabase.controller;

import com.packt.CarDatabase.domain.Car;
import com.packt.CarDatabase.repository.CarRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


import java.util.List;

@RestController
public class CarController {

    private final CarRepository repository;

    public CarController(CarRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/cars")
    public List<Car> getCars() {
        return repository.findAll();
    }
}