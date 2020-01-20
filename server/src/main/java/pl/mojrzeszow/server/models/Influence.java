package pl.mojrzeszow.server.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "influences")
public class Influence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    Long ducklings;
    Long points;
    Long people;
    Long peopleRange;
    Long shops;
    Long shopsRange;
    Long entertainment;
    Long entertainmentRange;
    Long work;
    Long workRange;
    Long medicalCare;
    Long medicalCareRange;
    Long services;
    Long servicesRange;
    Long goods;
    Long goodsRange;
    Long fireSafety;
    Long fireSafetyRange;
    Long crimePrevention;
    Long crimePreventionRange;
    Long energy;
    Long energyRange;
    Long cleanness;
    Long cleannessRange;
    Long science;
    Long scienceRange;

    public Influence() {
    }

    public Influence(Long id, Long ducklings, Long points, Long people, Long peopleRange, Long shops, Long shopsRange,
            Long entertainment, Long entertainmentRange, Long work, Long workRange, Long medicalCare,
            Long medicalCareRange, Long services, Long servicesRange, Long goods, Long goodsRange, Long fireSafety,
            Long fireSafetyRange, Long crimePrevention, Long crimePreventionRange, Long energy, Long energyRange,
            Long cleanness, Long cleannessRange, Long science, Long scienceRange) {
        this.id = id;
        this.ducklings = ducklings;
        this.points = points;
        this.people = people;
        this.peopleRange = peopleRange;
        this.shops = shops;
        this.shopsRange = shopsRange;
        this.entertainment = entertainment;
        this.entertainmentRange = entertainmentRange;
        this.work = work;
        this.workRange = workRange;
        this.medicalCare = medicalCare;
        this.medicalCareRange = medicalCareRange;
        this.services = services;
        this.servicesRange = servicesRange;
        this.goods = goods;
        this.goodsRange = goodsRange;
        this.fireSafety = fireSafety;
        this.fireSafetyRange = fireSafetyRange;
        this.crimePrevention = crimePrevention;
        this.crimePreventionRange = crimePreventionRange;
        this.energy = energy;
        this.energyRange = energyRange;
        this.cleanness = cleanness;
        this.cleannessRange = cleannessRange;
        this.science = science;
        this.scienceRange = scienceRange;
    }

    public Long getDucklings() {
        return ducklings;
    }

    public void setDucklings(Long ducklings) {
        this.ducklings = ducklings;
    }

    public Long getPoints() {
        return points;
    }

    public void setPoints(Long points) {
        this.points = points;
    }

    public Long getPeople() {
        return people;
    }

    public void setPeople(Long people) {
        this.people = people;
    }

    public Long getShops() {
        return shops;
    }

    public void setShops(Long shops) {
        this.shops = shops;
    }

    public Long getEntertainment() {
        return entertainment;
    }

    public void setEntertainment(Long entertainment) {
        this.entertainment = entertainment;
    }

    public Long getWork() {
        return work;
    }

    public void setWork(Long work) {
        this.work = work;
    }

    public Long getMedicalCare() {
        return medicalCare;
    }

    public void setMedicalCare(Long medicalCare) {
        this.medicalCare = medicalCare;
    }

    public Long getServices() {
        return services;
    }

    public void setServices(Long services) {
        this.services = services;
    }

    public Long getGoods() {
        return goods;
    }

    public void setGoods(Long goods) {
        this.goods = goods;
    }

    public Long getFireSafety() {
        return fireSafety;
    }

    public void setFireSafety(Long fireSafety) {
        this.fireSafety = fireSafety;
    }

    public Long getCrimePrevention() {
        return crimePrevention;
    }

    public void setCrimePrevention(Long crimePrevention) {
        this.crimePrevention = crimePrevention;
    }

    public Long getEnergy() {
        return energy;
    }

    public void setEnergy(Long energy) {
        this.energy = energy;
    }

    public Long getCleanness() {
        return cleanness;
    }

    public void setCleanness(Long cleanness) {
        this.cleanness = cleanness;
    }

    public Long getScience() {
        return science;
    }

    public void setScience(Long science) {
        this.science = science;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPeopleRange() {
        return peopleRange;
    }

    public void setPeopleRange(Long peopleRange) {
        this.peopleRange = peopleRange;
    }

    public Long getShopsRange() {
        return shopsRange;
    }

    public void setShopsRange(Long shopsRange) {
        this.shopsRange = shopsRange;
    }

    public Long getEntertainmentRange() {
        return entertainmentRange;
    }

    public void setEntertainmentRange(Long entertainmentRange) {
        this.entertainmentRange = entertainmentRange;
    }

    public Long getWorkRange() {
        return workRange;
    }

    public void setWorkRange(Long workRange) {
        this.workRange = workRange;
    }

    public Long getMedicalCareRange() {
        return medicalCareRange;
    }

    public void setMedicalCareRange(Long medicalCareRange) {
        this.medicalCareRange = medicalCareRange;
    }

    public Long getServicesRange() {
        return servicesRange;
    }

    public void setServicesRange(Long servicesRange) {
        this.servicesRange = servicesRange;
    }

    public Long getGoodsRange() {
        return goodsRange;
    }

    public void setGoodsRange(Long goodsRange) {
        this.goodsRange = goodsRange;
    }

    public Long getFireSafetyRange() {
        return fireSafetyRange;
    }

    public void setFireSafetyRange(Long fireSafetyRange) {
        this.fireSafetyRange = fireSafetyRange;
    }

    public Long getCrimePreventionRange() {
        return crimePreventionRange;
    }

    public void setCrimePreventionRange(Long crimePreventionRange) {
        this.crimePreventionRange = crimePreventionRange;
    }

    public Long getEnergyRange() {
        return energyRange;
    }

    public void setEnergyRange(Long energyRange) {
        this.energyRange = energyRange;
    }

    public Long getCleannessRange() {
        return cleannessRange;
    }

    public void setCleannessRange(Long cleannessRange) {
        this.cleannessRange = cleannessRange;
    }

    public Long getScienceRange() {
        return scienceRange;
    }

    public void setScienceRange(Long scienceRange) {
        this.scienceRange = scienceRange;
    }

}